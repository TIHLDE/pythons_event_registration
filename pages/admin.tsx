import type { NextPage } from "next";
import Container from "@mui/material/Container";
import NavBar from "../src/components/NavBar";
import Grid from "@mui/material/Grid";
import AdminLink from "components/AdminLink";
import Head from "next/head";

const Admin: NextPage = () => {
  return (
    <>
      <Head>
        <title>Admin - Pythons</title>
      </Head>
      <Grid container spacing={4} sx={{ marginTop: 4 }}>
        <Grid item xs={12} sm={4}>
          <AdminLink
            path="/admin/spillere"
            title="👨‍👧 Spillere"
            description="Se aktive spillere, og gjøre nødvendige endringer i spillerstallen"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <AdminLink
            path="/admin/arrangementer"
            title="🎉 Arrangementer"
            description="Gjør endringer på kommende arrangementer"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <AdminLink
            path="/admin/boter"
            title="🤫 Bøter"
            description="Se hvem av gutta som fortjener bøter basert på registrering"
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Admin;
