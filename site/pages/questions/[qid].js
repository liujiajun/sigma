import { useEffect } from 'react';
import {Divider, Box, Container, chakra,} from "@chakra-ui/react";
import { useRouter } from 'next/router';
import Header from "../../components/common/Header";
import Error from "next/error";

function AnswerBox(answer) {
  return (
      <>
        <Divider color="gray.500" mt="1rem" mb="1rem"/>
        <Container
            maxWidth="200"
        >
          { <div dangerouslySetInnerHTML={{ __html: answer.body }} /> }
        </Container>
      </>

  )
}

export default function Question({question, answers}) {
  const { isFallback } = useRouter();

  if (!isFallback && !question) {
    return <Error statusCode={404} title="Question not found" />;
  }

  if (isFallback) {
    return <p>Generating content...</p>
  }


  return (
      <>
        <Header/>
        <Box mb={20}>
          <Box
              as="section"
              pt={{ base: "5rem", md: "5rem" }}
              pb={{ base: "0", md: "5rem" }}
              maxW="3xl"
              mx="auto"
              textAlign="left"
              px="3"
          >
            <Box>
              <chakra.h1>
                {question.title}
              </chakra.h1>
              <Box pt="0.8rem">
                <div dangerouslySetInnerHTML={{ __html: question.body }} />
              </Box>
            </Box>
            <Box>
              { answers.map((answer) => AnswerBox(answer)) }
            </Box>
          </Box>
        </Box>

      </>
  )
}

export async function getStaticPaths() {
  return {
    paths: [
      {params: {qid: '1'}},
    ],
    fallback: true
  };
}

export async function getStaticProps({ params, locale }) {
  const { qid, lang } = params;

  const res = await fetch(`http://localhost:3000/api/questions/${params.qid}?lang=${locale}`)
  const data = await res.json()

  return {
    props: data
  }

}
