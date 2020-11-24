import {
  Divider, Box, Container, Text, chakra, VStack, HStack, Tag, TagLeftIcon, TagLabel,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Error from 'next/error';
import { TriangleUpIcon, TriangleDownIcon } from '@chakra-ui/icons';
import Header from '../../components/common/Header';
import LatexAndHtml from '../../components/common/LatexAndHtml';

function AnswerBox(answer) {
  return (
    <>
      <Divider mt={0} mb={0} />
      <Container
        maxW="200"
      >
        <Box
          w="100%"
          textAlign="left"
        >
          <HStack spacing={2}>
            <Tag size="lg" key="lg" variant="subtle" colorScheme="green">
              <TagLeftIcon boxSize="12px" as={TriangleUpIcon} />
              <TagLabel>{ answer.upvotecount }</TagLabel>
            </Tag>
            <Tag size="lg" key="lg" variant="subtle" colorScheme="red">
              <TagLeftIcon boxSize="12px" as={TriangleDownIcon} />
              <TagLabel>
                {answer.downvotecount}
              </TagLabel>
            </Tag>
          </HStack>
        </Box>
        <Container
          px={0}
          maxW="200"
          overflowX={{ base: 'auto', lg: 'visible' }}
        >
          <LatexAndHtml raw={answer.body} />
        </Container>

        <Box
          color="gray.500"
          fontSize="xs"
          mt={4}
        >
          Answered by
          {' '}
          { answer.ownerdisplayname }
        </Box>
      </Container>
    </>

  );
}

export default function QuestionAndAnswers({ question, answers }) {
  const { isFallback } = useRouter();

  if (!isFallback && !question) {
    return <Error statusCode={404} title="Question not found" />;
  }

  if (isFallback) {
    return <p>Generating content...</p>;
  }

  return (
    <>
      <Header />
      <Box
        as="section"
        w="full"
        pb={12}
        pt={14}
        mx="auto"
        maxWidth="5xl"
        px={{ base: '2', md: '6' }}
      >
        <Box mx="8">
          <chakra.h1>
            <LatexAndHtml raw={question.title} />
          </chakra.h1>
          <Box
            pt={1}
            pb={1}
          >
            <LatexAndHtml raw={question.body} />
          </Box>
        </Box>
        <VStack spacing="2rem">
          { answers.map((answer) => AnswerBox(answer)) }
        </VStack>
      </Box>

    </>
  );
}

export async function getStaticPaths() {
  return {
    paths: [
      { params: { qid: '30732' } },
    ],
    fallback: true,
  };
}

export async function getStaticProps({ params, locale }) {
  const { qid, lang } = params;

  const res = await fetch(`http://localhost:3000/api/questions/${params.qid}?lang=${locale}`);
  const data = await res.json();

  return {
    props: data,
  };
}
