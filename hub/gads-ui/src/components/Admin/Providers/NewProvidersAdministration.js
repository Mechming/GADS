import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, MenuItem, Stack, TextField, Tooltip } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { api } from "../../../services/api"
import { Auth } from "../../../contexts/Auth"

export default function NewProvidersAdministration() {
    const [providers, setProviders] = useState([])
    const { logout } = useContext(Auth)

    function handleGetProvidersData() {
        let url = `/admin/providers`

        api.get(url)
            .then(response => {
                console.log('meh')
                console.log(response.data)
                setProviders(response.data)
            })
            .catch(error => {
                if (error.response) {
                    if (error.response.status === 401) {
                        logout()
                    }
                }
            })
    }

    useEffect(() => {
        handleGetProvidersData()
    }, [])

    return (
        <Stack direction='row' spacing={2} style={{ width: '100%', marginLeft: '10px', marginTop: '10px' }}>
            <Box
                style={{
                    marginBottom: '10px',
                    height: '80vh',
                    overflowY: 'scroll',
                    border: '2px solid black',
                    borderRadius: '10px',
                    boxShadow: 'inset 0 -10px 10px -10px #000000',
                    scrollbarWidth: 'none',
                    marginRight: '10px',
                    width: '100%'
                }}
            >
                <Grid
                    container
                    spacing={2}
                    margin='10px'
                >
                    <Grid item>
                        <NewProvider handleGetProvidersData={handleGetProvidersData}>
                        </NewProvider>
                    </Grid>
                    {providers.map((provider) => {
                        console.log('adding new provider')
                        console.log(provider)
                        return (
                            <Grid item>
                                <ExistingProvider
                                    providerData={provider}
                                >
                                </ExistingProvider>
                            </Grid>
                        )
                    })
                    }
                </Grid>
            </Box>
        </Stack>
    )
}

function NewProvider({ handleGetProvidersData }) {
    const [os, setOS] = useState('windows')
    const [nickname, setNickname] = useState('')
    const [hostAddress, setHostAddress] = useState('')
    const [port, setPort] = useState(0)
    const [ios, setIos] = useState(false)
    const [android, setAndroid] = useState(false)
    const [wdaRepoPath, setWdaRepoPath] = useState('')
    const [wdaBundleId, setWdaBundleId] = useState('')
    const [useCustomWda, setUseCustomWda] = useState(false)
    const [useSeleniumGrid, setUseSeleniumGrid] = useState(false)
    const [seleniumGridInstance, setSeleniumGridInstance] = useState('')

    function buildPayload() {
        let body = {}
        body.os = os
        body.host_address = hostAddress
        body.nickname = nickname
        body.port = port
        body.provide_android = android
        body.provide_ios = ios
        if (ios) {
            body.wda_bundle_id = wdaBundleId
            body.wda_repo_path = wdaRepoPath
            body.use_custom_wda = useCustomWda
        }
        body.use_selenium_grid = useSeleniumGrid
        if (useSeleniumGrid) {
            body.selenium_grid = seleniumGridInstance
        }

        let bodyString = JSON.stringify(body)
        return bodyString
    }

    function handleAddProvider(event) {
        event.preventDefault()

        let url = `/admin/providers/add`
        let bodyString = buildPayload()

        api.post(url, bodyString, {})
            .then(() => {
                setOS('windows')
                setNickname('')
                setHostAddress('')
                setPort(0)
                setIos(false)
                setAndroid(false)
                setWdaRepoPath('')
                setWdaBundleId('')
                setUseCustomWda(false)
                setUseSeleniumGrid(false)
                setSeleniumGridInstance('')
                handleGetProvidersData()
            })
            .catch(() => {

            })
    }

    return (
        <Box
            id='some-box'
            style={{
                border: '1px solid black',
                width: '400px',
                minWidth: '400px',
                maxWidth: '400px',
                height: '730px',
                borderRadius: '5px',
                backgroundColor: '#9ba984'
            }}
        >
            <form onSubmit={handleAddProvider}>
                <Stack
                    spacing={2}
                    style={{
                        padding: '10px'
                    }}
                >
                    <Tooltip
                        title="Provider OS"
                        arrow
                        placement='top'
                    >
                        <FormControl fullWidth variant="outlined" required>
                            <TextField
                                style={{ width: "100%" }}
                                variant="outlined"
                                value={os}
                                onChange={(e) => setOS(e.target.value)}
                                select
                                label="OS"
                                required
                                size='small'
                            >
                                <MenuItem value='windows'>Windows</MenuItem>
                                <MenuItem value='linux'>Linux</MenuItem>
                                <MenuItem value='darwin'>macOS</MenuItem>
                            </TextField>
                        </FormControl>
                    </Tooltip>
                    <Tooltip
                        title="Unique name for the provider"
                        arrow
                    >
                        <TextField
                            required
                            label="Nickname"
                            value={nickname}
                            autoComplete="off"
                            size='small'
                            onChange={(event) => setNickname(event.target.value)}
                        />
                    </Tooltip>
                    <Tooltip
                        title="Host local network address, e.g. 192.168.1.6"
                        arrow
                    >
                        <TextField
                            required
                            label="Host address"
                            value={hostAddress}
                            autoComplete="off"
                            size='small'
                            onChange={(event) => setHostAddress(event.target.value)}
                        />
                    </Tooltip>
                    <Tooltip
                        title="Port for the provider instance, e.g. 10001"
                        arrow
                    >
                        <TextField
                            required
                            label="Port"
                            value={port}
                            autoComplete="off"
                            size='small'
                            onChange={(event) => setPort(Number(event.target.value))}
                        />
                    </Tooltip>
                    <Tooltip
                        title="Should the provider set up iOS devices?"
                        arrow
                        placement='top'
                    >
                        <FormControl fullWidth variant="outlined" required>
                            <TextField
                                style={{ width: "100%" }}
                                variant="outlined"
                                value={ios}
                                onChange={(e) => setIos(e.target.value)}
                                select
                                size='small'
                                label="Provide iOS?"
                                required
                            >
                                <MenuItem value={true}>Yes</MenuItem>
                                <MenuItem value={false}>No</MenuItem>
                            </TextField>
                        </FormControl>
                    </Tooltip>
                    <Tooltip
                        title="Should the provider set up Android devices?"
                        arrow
                        placement='top'
                    >
                        <FormControl fullWidth variant="outlined" required>
                            <TextField
                                style={{ width: "100%" }}
                                variant="outlined"
                                value={android}
                                onChange={(e) => setAndroid(e.target.value)}
                                select
                                label="Provide Android?"
                                required
                                size='small'
                            >
                                <MenuItem value={true}>Yes</MenuItem>
                                <MenuItem value={false}>No</MenuItem>
                            </TextField>
                        </FormControl>
                    </Tooltip>
                    <Tooltip
                        title="WebDriverAgent bundle identifier, e.g. com.facebook.WebDriverAgentRunner.xctrunner"
                        arrow
                    >
                        <TextField
                            required
                            size='small'
                            label="WDA bundle ID"
                            value={wdaBundleId}
                            disabled={!ios}
                            autoComplete="off"
                            onChange={(event) => setWdaBundleId(event.target.value)}
                        />
                    </Tooltip>
                    <Tooltip
                        title="WebDriverAgent repository path on the host from which it will be built with `xcodebuild`, e.g. /Users/shamanec/repos/WebDriverAgent"
                        arrow
                    >
                        <TextField
                            required
                            size='small'
                            label="WDA repo path"
                            value={wdaRepoPath}
                            disabled={!ios || (ios && os !== 'darwin')}
                            autoComplete="off"
                            onChange={(event) => setWdaRepoPath(event.target.value)}
                        />
                    </Tooltip>
                    <Tooltip
                        title="Select `Yes` if you are using the custom WebDriverAgent from my repositories. It allows for faster tapping/swiping actions on iOS. If you are using mainstream WDA this will break your interactions!"
                        arrow
                        placement='top'
                    >
                        <FormControl fullWidth variant="outlined" required>
                            <TextField
                                style={{ width: "100%" }}
                                variant="outlined"
                                size='small'
                                value={useCustomWda}
                                onChange={(e) => setUseCustomWda(e.target.value)}
                                select
                                label="Use custom WDA?"
                                required
                            >
                                <MenuItem value={true}>Yes</MenuItem>
                                <MenuItem value={false}>No</MenuItem>
                            </TextField>
                        </FormControl>
                    </Tooltip>
                    <Tooltip
                        title="Select `Yes` if you want the provider to register the devices Appium servers as Selenium Grid nodes. You need to have the Selenium Grid instance running separately from the provider!"
                        arrow
                        placement='top'
                    >
                        <FormControl fullWidth variant="outlined" required>
                            <TextField
                                style={{ width: "100%" }}
                                variant="outlined"
                                size='small'
                                value={useSeleniumGrid}
                                onChange={(e) => setUseSeleniumGrid(e.target.value)}
                                select
                                label="Use Selenium Grid?"
                                required
                            >
                                <MenuItem value={true}>Yes</MenuItem>
                                <MenuItem value={false}>No</MenuItem>
                            </TextField>
                        </FormControl>
                    </Tooltip>
                    <Tooltip
                        title="Selenium Grid instance address, e.g. http://192.168.1.6:4444"
                        arrow
                    >
                        <TextField
                            required
                            size='small'
                            label="Selenium Grid instance"
                            value={seleniumGridInstance}
                            autoComplete="off"
                            disabled={!useSeleniumGrid}
                            onChange={(event) => setSeleniumGridInstance(event.target.value)}
                        />
                    </Tooltip>
                    <Button
                        variant="contained"
                        type="submit"
                        style={{
                            backgroundColor: '#2f3b26',
                            color: '#f4e6cd'
                        }}
                    >Add provider</Button>
                </Stack>
            </form>
        </Box>
    )
}

function ExistingProvider({ providerData, handleGetProvidersData }) {
    const [os, setOS] = useState(providerData.os)
    const [nickname, setNickname] = useState(providerData.nickname)
    const [hostAddress, setHostAddress] = useState(providerData.host_address)
    const [port, setPort] = useState(providerData.port)
    const [ios, setIos] = useState(providerData.provide_ios)
    const [android, setAndroid] = useState(providerData.provide_android)
    const [wdaRepoPath, setWdaRepoPath] = useState(providerData.wda_repo_path)
    const [wdaBundleId, setWdaBundleId] = useState(providerData.wda_bundle_id)
    const [useCustomWda, setUseCustomWda] = useState(providerData.use_custom_wda)
    const [useSeleniumGrid, setUseSeleniumGrid] = useState(providerData.use_selenium_grid)
    const [seleniumGridInstance, setSeleniumGridInstance] = useState(providerData.selenium_grid)

    const [openAlert, setOpenAlert] = useState(false)

    function handleDeleteProvider(event) {
        event.preventDefault()

        let url = `/admin/providers/${nickname}`

        api.delete(url)
            .catch(e => {
            })
            .finally(() => {
                handleGetProvidersData()
                setOpenAlert(false)
            })
    }

    function buildPayload() {
        let body = {}
        body.os = os
        body.host_address = hostAddress
        body.nickname = nickname
        body.port = port
        body.provide_android = android
        body.provide_ios = ios
        if (ios) {
            body.wda_bundle_id = wdaBundleId
            body.wda_repo_path = wdaRepoPath
            body.use_custom_wda = useCustomWda
        }
        body.use_selenium_grid = useSeleniumGrid
        if (useSeleniumGrid) {
            body.selenium_grid = seleniumGridInstance
        }

        let bodyString = JSON.stringify(body)
        return bodyString
    }

    function handleUpdateProvider(event) {
        event.preventDefault()

        let url = `/admin/providers/update`
        let bodyString = buildPayload()

        api.post(url, bodyString, {})
            .then(() => {

            })
            .catch(() => {

            })
    }

    return (
        <Box
            id='some-box'
            style={{
                border: '1px solid black',
                width: '400px',
                minWidth: '400px',
                maxWidth: '400px',
                height: '730px',
                borderRadius: '5px',
                backgroundColor: '#9ba984'
            }}
        >
            <form onSubmit={handleUpdateProvider}>
                <Stack
                    spacing={2}
                    style={{
                        padding: '10px'
                    }}
                >
                    <Tooltip
                        title="Provider OS"
                        arrow
                        placement='top'
                    >
                        <FormControl fullWidth variant="outlined" required>
                            <TextField
                                style={{ width: "100%" }}
                                variant="outlined"
                                value={os}
                                onChange={(e) => setOS(e.target.value)}
                                select
                                label="OS"
                                required
                                size='small'
                            >
                                <MenuItem value='windows'>Windows</MenuItem>
                                <MenuItem value='linux'>Linux</MenuItem>
                                <MenuItem value='darwin'>macOS</MenuItem>
                            </TextField>
                        </FormControl>
                    </Tooltip>
                    <Tooltip
                        title="Unique name for the provider"
                        arrow
                    >
                        <TextField
                            required
                            label="Nickname"
                            value={nickname}
                            autoComplete="off"
                            size='small'
                            onChange={(event) => setNickname(event.target.value)}
                        />
                    </Tooltip>
                    <Tooltip
                        title="Host local network address, e.g. 192.168.1.6"
                        arrow
                    >
                        <TextField
                            required
                            label="Host address"
                            value={hostAddress}
                            autoComplete="off"
                            size='small'
                            onChange={(event) => setHostAddress(event.target.value)}
                        />
                    </Tooltip>
                    <Tooltip
                        title="Port for the provider instance, e.g. 10001"
                        arrow
                    >
                        <TextField
                            required
                            label="Port"
                            value={port}
                            autoComplete="off"
                            size='small'
                            onChange={(event) => setPort(Number(event.target.value))}
                        />
                    </Tooltip>
                    <Tooltip
                        title="Should the provider set up iOS devices?"
                        arrow
                        placement='top'
                    >
                        <FormControl fullWidth variant="outlined" required>
                            <TextField
                                style={{ width: "100%" }}
                                variant="outlined"
                                value={ios}
                                onChange={(e) => setIos(e.target.value)}
                                select
                                size='small'
                                label="Provide iOS?"
                                required
                            >
                                <MenuItem value={true}>Yes</MenuItem>
                                <MenuItem value={false}>No</MenuItem>
                            </TextField>
                        </FormControl>
                    </Tooltip>
                    <Tooltip
                        title="Should the provider set up Android devices?"
                        arrow
                        placement='top'
                    >
                        <FormControl fullWidth variant="outlined" required>
                            <TextField
                                style={{ width: "100%" }}
                                variant="outlined"
                                value={android}
                                onChange={(e) => setAndroid(e.target.value)}
                                select
                                label="Provide Android?"
                                required
                                size='small'
                            >
                                <MenuItem value={true}>Yes</MenuItem>
                                <MenuItem value={false}>No</MenuItem>
                            </TextField>
                        </FormControl>
                    </Tooltip>
                    <Tooltip
                        title="WebDriverAgent bundle identifier, e.g. com.facebook.WebDriverAgentRunner.xctrunner"
                        arrow
                    >
                        <TextField
                            required
                            size='small'
                            label="WDA bundle ID"
                            value={wdaBundleId}
                            disabled={!ios}
                            autoComplete="off"
                            onChange={(event) => setWdaBundleId(event.target.value)}
                        />
                    </Tooltip>
                    <Tooltip
                        title="WebDriverAgent repository path on the host from which it will be built with `xcodebuild`, e.g. /Users/shamanec/repos/WebDriverAgent"
                        arrow
                    >
                        <TextField
                            required
                            size='small'
                            label="WDA repo path"
                            value={wdaRepoPath}
                            disabled={!ios || (ios && os !== 'darwin')}
                            autoComplete="off"
                            onChange={(event) => setWdaRepoPath(event.target.value)}
                        />
                    </Tooltip>
                    <Tooltip
                        title="Select `Yes` if you are using the custom WebDriverAgent from my repositories. It allows for faster tapping/swiping actions on iOS. If you are using mainstream WDA this will break your interactions!"
                        arrow
                        placement='top'
                    >
                        <FormControl fullWidth variant="outlined" required>
                            <TextField
                                style={{ width: "100%" }}
                                variant="outlined"
                                size='small'
                                value={useCustomWda}
                                onChange={(e) => setUseCustomWda(e.target.value)}
                                select
                                label="Use custom WDA?"
                                required
                            >
                                <MenuItem value={true}>Yes</MenuItem>
                                <MenuItem value={false}>No</MenuItem>
                            </TextField>
                        </FormControl>
                    </Tooltip>
                    <Tooltip
                        title="Select `Yes` if you want the provider to register the devices Appium servers as Selenium Grid nodes. You need to have the Selenium Grid instance running separately from the provider!"
                        arrow
                        placement='top'
                    >
                        <FormControl fullWidth variant="outlined" required>
                            <TextField
                                style={{ width: "100%" }}
                                variant="outlined"
                                size='small'
                                value={useSeleniumGrid}
                                onChange={(e) => setUseSeleniumGrid(e.target.value)}
                                select
                                label="Use Selenium Grid?"
                                required
                            >
                                <MenuItem value={true}>Yes</MenuItem>
                                <MenuItem value={false}>No</MenuItem>
                            </TextField>
                        </FormControl>
                    </Tooltip>
                    <Tooltip
                        title="Selenium Grid instance address, e.g. http://192.168.1.6:4444"
                        arrow
                    >
                        <TextField
                            required
                            size='small'
                            label="Selenium Grid instance"
                            value={seleniumGridInstance}
                            autoComplete="off"
                            disabled={!useSeleniumGrid}
                            onChange={(event) => setSeleniumGridInstance(event.target.value)}
                        />
                    </Tooltip>
                    <Button
                        variant="contained"
                        type="submit"
                        style={{
                            backgroundColor: '#2f3b26',
                            color: '#f4e6cd'
                        }}
                    >Update provider</Button>
                    <Button
                        onClick={() => setOpenAlert(true)}
                        style={{
                            backgroundColor: 'orange',
                            color: '#2f3b26'
                        }}
                    >Delete provider</Button>
                    <Dialog
                        open={openAlert}
                        onClose={() => setOpenAlert(false)}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            {"Delete provider from DB?"}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Nickname: {nickname}. Host address: {hostAddress}.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenAlert(false)}>Cancel</Button>
                            <Button onClick={handleDeleteProvider} autoFocus>
                                Confirm
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Stack>
            </form>
        </Box>
    )

}

