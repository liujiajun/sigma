import {Divider, Box, Container, chakra,} from "@chakra-ui/react";
import { useRouter } from 'next/router';
import Header from "../../components/common/Header";

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

  if (isFallback) {
    return <p>Generating</p>
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

// export async function getServerSideProps(context) {
//   const res = await fetch(`http://localhost:3000/api/questions/${context.params.qid}`)
//   const data = await res.json()
//   console.log(data)
//   return {
//     props: data
//   }
// }

export async function getStaticPaths() {
  return {
    paths: [
      {params: {qid: '1'}},
      {params: {qid: '2'}}
        ],
    fallback: true
  };
}

export async function getStaticProps({ params }) {
  const { qid } = params;

  const res = await fetch(`http://localhost:3000/api/questions/${params.qid}`)
  const data = await res.json()

  return {
    props: data
  }

}
