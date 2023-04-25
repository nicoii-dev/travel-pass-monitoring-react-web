import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Carousel from "react-material-ui-carousel";
// @mui
import { styled } from "@mui/material/styles";
import {
  Container,
  Paper,
  Typography,
  Link,
  Box,
  Avatar,
  Button,
} from "@mui/material";
import { isMobile } from "react-device-detect";
// components
import Page from "../components/Page";
import Iconify from "../components/Iconify";
// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "grid",
  },
  // backgroundImage: `url(${'assets/background/background2.jpg'})`,
  // backgroundPosition: 'center',
  // // backgroundSize: 'cover',
  backgroundColor: "#FFD700",
  height: "100vh",
}));

// ----------------------------------------------------------------------

const image1 = "/assets/landing/image1.jpg";
const image2 = "/assets/landing/image2.jpg";
const image3 = "/assets/landing/image3.jpg";
const image4 = "/assets/landing/image4.jpg";

export default function LandingPage() {
  const navigate = useNavigate();

  var items = [
    {
      id: "1",
      image: image1,
    },
    {
      id: "2",
      image: image2,
    },
    {
      id: "3",
      image: image3,
    },
    {
      id: "4",
      image: image4,
    },
  ];
  return (
    <Page title="Landing">
      <svg
        width="500"
        height="80"
        viewBox="0 0 500 80"
        preserveAspectRatio="none"
        style={{ width: "100%", position: "absolute", top: 0, height: 200 }}
      >
        <path d="M0,0 L0,40 Q250,80 500,40 L500,0 Z" fill="black" />
      </svg>
      <Box
        sx={{
          display: isMobile ? "flex" : "inline-flex",
          justifyContent: "center",
          top: 10,
          left: 100,
          position: "absolute",
        }}
      >
        <Avatar
          alt="Remy Sharp"
          src="assets/icons/iligan-icon.jpg"
          sx={{ width: 100, height: 100 }}
        />
      </Box>
      <Box sx={{ position: "absolute", top: 40, right: 100 }}>
        <Link href="/signin">
          <Typography sx={{fontSize: 20, fontFamily: "monospace", color: "#F0ECCF"}}>Get Started</Typography>
        </Link>
      </Box>

      <RootStyle>
        <Container
          maxWidth="xl"
          sx={{
            mt: 20,
            mb: 15,
            padding: 5,
            borderRadius: 2,
            backgroundColor: "white",
            width: "100%",
            zIndex: 999,
          }}
        >
          <Carousel
            NextIcon={<Iconify icon={"ooui:next-ltr"} />}
            PrevIcon={<Iconify icon={"ooui:next-rtl"} />}
          >
            {items.map((item, i) => (
              <Item key={i} item={item} />
            ))}
          </Carousel>
        </Container>
      </RootStyle>
    </Page>
  );
}

function Item(props) {
  return (
    <Paper>
      <img
        src={`${props.item.image}`}
        alt={props.item.image}
        height={600}
        width={"100%"}
      />
    </Paper>
  );
}
