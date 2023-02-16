import axios from 'axios';
import * as React from 'react';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Alert, Box, Card, CardContent, CardMedia, Typography, TextField, LinearProgress, InputAdornment, IconButton } from '@mui/material';
import { Download, ContentPasteGo } from '@mui/icons-material';

import '@fortawesome/fontawesome-free/css/all.min.css';
import moment from 'moment';
const notify = (type, message) => {
    toast[type](message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
    });
}
function download(url) {
    return new Promise((resolve, reject) => {
        if (!url.includes('soundcloud.com')) {
            return notify('error', 'Đường dẫn không hợp lệ!')
        }
        axios({
            url: `https://thieutrungkien.dev/soundcloud/track?url=${url}`,
            method: 'GET',
            responseType: 'json',
        }).then((response) => {
            console.log(response);
            const data = response.data;
            if ('music' in data) {
                const { thumbnail, title, download_url, likes_count, created_at, reposts_count } = data.music;
                const { full_name, id, followers_count } = data.users;
                resolve({
                    thumbnail,
                    title,
                    download_url,
                    likes_count,
                    full_name,
                    id,
                    followers_count,
                    created_at,
                    reposts_count
                })
            }
        }).catch((error) => {
            return reject(error);
        })
    });
}

const SoundCloud = () => {
    const [url, setUrl] = useState('');
    const [music, setMusic] = useState(null);
    const [error, setError] = useState(null);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(0);
    const handleUrlChange = (event) => {
        setUrl(event.target.value);
    }

    const handleDownload = () => {
        download(url).then((music) => {
            setError(false)
            setMusic(music);
            setShow(true);
        }).catch((error) => {
            setError(error);
            notify('error', 'Đã có lỗi xảy ra!');
        })
    }
    function LinearProgressWithLabel(props) {
        if (props.value === 100) setTimeout(() => setLoading(0), 1000);
        return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress variant="determinate" {...props} />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                    <Typography variant="body2" color="text.secondary">{`${Math.round(
                        props.value,
                    )}%`}</Typography>
                </Box>
            </Box>
        );
    }
    const handlePaste = () => {
        navigator.clipboard.readText().then((text) => {
            setUrl(text);
        })
    }
    const handleDownloadMusic = () => {
        notify('info', 'Đang chuẩn bị tải xuống...');
        axios({
            url: music.download_url,
            method: 'GET',
            responseType: 'blob',
            onDownloadProgress: (progressEvent) => {
                const { loaded, total } = progressEvent;
                const percent = Math.floor((loaded * 100) / total);
                setLoading(percent);
            }
        }).then((response) => {
            var url = window.URL.createObjectURL(new Blob([response.data]));
            var a = document.createElement('a');
            a.href = url;
            a.download = `${music.title}.mp3`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            setShow(false);
            notify('success', 'Đang bắt đầu tải xuống!');
        }).catch((error) => {
            notify('error', 'Đã có lỗi xảy ra!');
            console.log(error);
        })
    }
    return (
        <>
            <div className="container">
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                />
                <div className="row">
                    <div className="col-md-12">
                        <TextField fullWidth id="outlined-basic" label="URL" variant="outlined" value={url} onChange={handleUrlChange} style={{
                            margin: "10px"
                        }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton style={{ color: '#000000' }} onClick={handlePaste}><ContentPasteGo /></IconButton>
                                        <IconButton style={{ color: '#000000' }} onClick={handleDownload} ><Download /></IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        {show && (
                            <Card sx={{ display: 'flex' }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', width: "100%" }}>
                                    <CardContent sx={{ flex: '1 0 auto' }}>
                                        <Typography component="div" variant="h5">
                                            {music.title}
                                        </Typography>
                                        <Typography variant="subtitle1" color="text.secondary" component="div">
                                            Likes: {music.likes_count}
                                        </Typography>
                                        <Typography variant="subtitle1" color="text.secondary" component="div">
                                            Upload at: {moment(music.created_at).format('DD/MM/YYYY')}
                                        </Typography>
                                        <Typography variant="subtitle1" color="text.secondary" component="div">
                                            Author: {music.full_name}
                                        </Typography>
                                    </CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                                        <Button onClick={handleDownloadMusic} style={{ margin: 'auto', display: 'block' }}>Download</Button>
                                    </Box>
                                </Box>
                                <CardMedia
                                    component="img"
                                    sx={{
                                        width: 151,
                                        borderRadius: '50%',
                                        height: 151,
                                        margin: 'auto',
                                    }}
                                    image={music.thumbnail}
                                    alt="Live from space album cover"
                                />
                            </Card>
                        )}
                        <div className="row">
                            <div className="col-md-12">
                                {error && (
                                    <Alert variant="filled" severity="error">
                                        {error.message}
                                    </Alert>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    {
                        loading > 0 && (
                            <div className="col-md-12">
                                <LinearProgressWithLabel value={loading} />
                            </div>
                        )
                    }
                </div>
            </div>
        </>
    )
}

export default SoundCloud;