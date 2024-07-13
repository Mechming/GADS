import {Box, Dialog, DialogContent, Grid} from "@mui/material";
import { Button } from "@mui/material";
import { Stack } from "@mui/material";
import { useDialog } from "../../SessionDialogContext";
import { api } from '../../../../services/api.js'
import React, { useState, memo } from 'react';
import CircularProgress from "@mui/material/CircularProgress";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

function Screenshot({ udid, screenshots, setScreenshots }) {
    const { setDialog } = useDialog()
    const [open, setOpen] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null)
    const [isTakingScreenshot, setIsTakingScreenshot] = useState(false)
    const [takeScreenshotStatus, setTakeScreenshotStatus] = useState(null)

    function takeScreenshot() {
        setIsTakingScreenshot(true)
        setTakeScreenshotStatus(null)

        let imageBase64String = null
        const url = `/device/${udid}/screenshot`
        api.post(url)
            .then(response => {
                if (response.status === 404) {
                    setDialog(true)
                    return
                }
                return response.data
            })
            .then(screenshotJson => {
                imageBase64String = screenshotJson.value
            })
            .catch(() => {
                setTakeScreenshotStatus('error')
            })
            .finally(() => {
                setTimeout(() => {
                    setIsTakingScreenshot(false)
                    if (imageBase64String) {
                        createThumbnail(imageBase64String, (thumbnailBase64) => {
                            setScreenshots(prevScreenshots => [...prevScreenshots, { full: imageBase64String, thumbnail: thumbnailBase64 }])
                        })
                    }
                    setTimeout(() => {
                        setTakeScreenshotStatus(null)
                    }, 1000)
                }, 500)
            })
    }

    function createThumbnail(base64Image, callback) {
        const img = new Image()
        img.src = `data:image/png;base64,${base64Image}`
        img.onload = () => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')

            const height = 400
            const width = (img.width * height) / img.height

            canvas.width = width
            canvas.height = height
            ctx.drawImage(img, 0, 0, width, height)
            const thumbnailBase64 = canvas.toDataURL('image/png').split(',')[1]
            callback(thumbnailBase64)
        }
    }

    const handleClickOpen = (image) => {
        setSelectedImage(image)
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <Box
            style={{
                marginTop: '20px'
            }}
        >
            <Stack
                style={{
                    height: '800px',
                    width: '100%'
                }}
            >
                <Button
                    onClick={() => takeScreenshot()}
                    variant="contained"
                    style={{
                        marginBottom: '10px',
                        backgroundColor: '#2f3b26',
                        color: '#9ba984',
                        fontWeight: 'bold',
                        width: '200px',
                        height: '40px'
                    }}
                    disabled={isTakingScreenshot || takeScreenshotStatus === 'error'}
                >
                    {isTakingScreenshot ? (
                        <CircularProgress size={25} style={{ color: '#f4e6cd' }} />
                    ) : takeScreenshotStatus === 'error' ? (
                        <CloseIcon size={25} style={{ color: 'red', stroke: 'red', strokeWidth: 2 }} />
                    ) : (
                        'Take screenshot'
                    )}
                </Button>
                <Box
                    style={{
                        maxHeight: '800px',
                        overflowY: 'auto'
                    }}
                >
                    <Grid container spacing={2}>
                        {screenshots.map((screenshot, index) => (
                            <Grid item key={index}>
                                <img
                                    src={`data:image/png;base64,${screenshot.thumbnail}`}
                                    alt={`Screenshot ${index + 1}`}
                                    style={{
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => handleClickOpen(`data:image/png;base64,${screenshot.full}`)}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Stack>
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="sm"
                style={{
                    overflowY: 'hidden'
                }}
            >
                <DialogContent>
                    <img
                        src={selectedImage}
                        alt='Selected Screenshot'
                        style={{
                            width: '100%',
                            height: 'auto'
                        }}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
}
export default React.memo(Screenshot)

