import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Container from "@mui/material/Container";
import NavBar from "components/NavBar";
import Grid from "@mui/material/Grid";
import { prisma } from "lib/prisma";
import safeJsonStringify from "safe-json-stringify";

export const getServerSideProps: GetServerSideProps = async () => {
  const test = "test";

  return { props: { test } };
};

const Fines: NextPage = ({
  test,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Container maxWidth="lg" sx={{ padding: 4 }}>
      <NavBar />
    </Container>
  );
};

export default Fines;
