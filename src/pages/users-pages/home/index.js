import React from "react";
import Carousel from "react-material-ui-carousel";
// @mui
import { styled } from "@mui/material/styles";
import { Container, Paper } from "@mui/material";
// components
import Page from "../../../components/Page";
import Iconify from "../../../components/Iconify";
// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "grid",
  },
  backgroundColor: "#FFD700",
  height: "60vh",
}));

// ----------------------------------------------------------------------

const image1 = "/assets/landing/image1.jpg";
const image2 = "/assets/landing/image2.jpg";
const image3 = "/assets/landing/image3.jpg";
const image4 = "/assets/landing/image4.jpg";

export default function HomePage() {
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
      <RootStyle>
        <Container
          maxWidth="xl"
          sx={{
            mt: 0,
            mb: 40,
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
