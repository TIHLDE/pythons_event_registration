import type { NextPage } from "next";
import Container from "@mui/material/Container";
import NavBar from "../src/components/NavBar";
import Event from "../src/components/Event";
import Grid from "@mui/material/Grid";
import { IEvent } from "types";
import AdminLink from "components/AdminLink";

const Admin: NextPage = () => {
  return (
    <Container maxWidth="lg" sx={{ padding: 4 }}>
      <NavBar />
      <Grid container spacing={4} sx={{ marginTop: 4 }}>
        <Grid item xs={12} sm={4}>
          <AdminLink
            path="/players"
            title="Spillere"
            description="Se aktive spillere, og gjøre nødvendige endringer i spillerstallen"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <AdminLink
            path="/events"
            title="Arrangementer"
            description="Gjør endringer på kommende arrangementer"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <AdminLink
            path="/fines"
            title="Bøter 🤫"
            description="Se hvem av gutta som fortjener bøter basert på registrering"
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Admin;
