import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import { useNavigate } from "react-router-dom";

export default function SelectDemoPage() {
  const navigate = useNavigate();

  const handleDemoSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const data = new FormData(event.currentTarget);
      const demoId = data.get("demoId");

      navigate(`/demo/${demoId}`);
    },
    [navigate]
  );

  const handleIframeSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const data = new FormData(event.currentTarget);
      const iframeUrl = data.get("iframeUrl");

      navigate({
        pathname: "/iframe",
        search: `url=${iframeUrl}`,
      });
    },
    [navigate]
  );

  return (
    <Container component="main">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Box
          sx={{
            mt: 1,
            display: "flex",
            justifyContent: "space-evenly",
          }}
        >
          <Box
            style={{ width: "45%" }}
            component="form"
            onSubmit={handleIframeSubmit}
            noValidate
          >
            <Typography component="h1" variant="h6">
              Specify Iframe Url
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              name="iframeUrl"
              label="Iframe"
              autoComplete="iframeUrl"
              helperText="Url to put in the iframe. Usable for demo and testing purposes"
              sx={{ paddingBottom: 0, marginBottom: 0 }}
              autoFocus
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 2, bgcolor: "secondary.main" }}
            >
              Show Demo In IFrame
            </Button>
          </Box>

          <Divider variant="fullWidth" orientation="vertical" flexItem />

          <Box
            style={{ width: "45%" }}
            component="form"
            onSubmit={handleDemoSubmit}
            noValidate
          >
            <Typography component="h1" variant="h6">
              Specify Your Demo Id
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              name="demoId"
              label="Demo ID"
              helperText="Demo id to show all the webhook history"
              sx={{ paddingBottom: 0, marginBottom: 0 }}
              autoFocus
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 2 }}
            >
              Show Demo Webhooks
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
