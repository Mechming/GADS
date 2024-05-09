package device

import (
	"encoding/json"
	"io"
	"net"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gobwas/ws/wsutil"
)

var clients = make(map[net.Conn]bool)
var mu sync.Mutex

func AvailableDeviceSSE(c *gin.Context) {
	c.Stream(func(w io.Writer) bool {
		jsonData, _ := json.Marshal(&latestDevices)
		c.SSEvent("", string(jsonData))
		c.Writer.Flush()
		time.Sleep(1 * time.Second)
		return true
	})
}

// Wait to receive a message on the connection.
// If it errors out or the message is close frame,
// clean up the connection and remove the client from the map.
// With this we can immediately clean up resources instead of waiting for the browser to gracefully close the connection in around 30s
func monitorConnClose(client net.Conn) {
	for {
		msg, err := wsutil.ReadClientMessage(client, nil)
		// If we got io.EOF error then the ws was probably abnormally closed
		// Remove the client
		if err == io.EOF {
			client.Close()
			mu.Lock()
			delete(clients, client)
			mu.Unlock()
			return
		}

		// If we get Op.Code = 8, then we received a close frame and we can remove the client
		if msg[0].OpCode == 8 {
			client.Close()
			mu.Lock()
			delete(clients, client)
			mu.Unlock()
			return
		}
	}
}

func GetDevices() {
	for {
		jsonData, _ := json.Marshal(&latestDevices)
		for _, device := range latestDevices {
			if device.Connected && device.LastUpdatedTimestamp >= (time.Now().UnixMilli()-5000) {
				device.Available = true
				continue
			}
			device.Available = false
		}

		for client := range clients {
			err := wsutil.WriteServerText(client, jsonData)
			if err != nil {
				client.Close()
				mu.Lock()
				delete(clients, client)
				mu.Unlock()
			}
		}

		time.Sleep(1 * time.Second)
	}
}
