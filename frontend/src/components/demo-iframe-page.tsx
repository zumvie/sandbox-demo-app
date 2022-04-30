import * as React from "react";
import { useSearchParams } from "react-router-dom";
import { Typography, TextField, Box, Container } from "@mui/material";

export default function DemoIframePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleChange = (event: any) => {
    setSearchParams({
      url: event.target.value,
    });
  };

  React.useEffect(() => {
    // if iframe is empty
    if (searchParams.get("url")) {
      return;
    }
    setSearchParams({
      url: "https://www.openstreetmap.org/export/embed.html",
    });
  }, []);

  return (
    <Container component="main">
      <Box
        sx={{
          display: "flex",
          maxWidth: "800px",
          justifyContent: "center",
          alignContent: "center",
          flexDirection: "column",
        }}
      >
        <Typography
          component="h1"
          variant="h6"
          sx={{ textAlign: "center", marginTop: 8 }}
        >
          Iframe View
        </Typography>
        <TextField
          margin="normal"
          required
          fullWidth
          onChange={handleChange}
          name="iframeUrl"
          value={
            searchParams.get("url") ||
            "https://www.openstreetmap.org/export/embed.html"
          }
          helperText="Url to put in the iframe. Usable for demo and testing purposes"
          sx={{ paddingBottom: 0, marginBottom: 0 }}
          autoFocus
        />

        <iframe
          src={searchParams.get("url") || ""}
          // sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          style={{
            border: "none",
            backgroundColor: "grey",
          }}
          width="800px"
          height="600px"
        ></iframe>
      </Box>
    </Container>
  );
}
