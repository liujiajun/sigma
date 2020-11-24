import {
  Divider, Box, Container, Text, chakra, VStack, HStack, Tag, TagLeftIcon, TagLabel,
} from '@chakra-ui/react';
import Header from "../components/common/Header";

function QuestionBox() {
  return (
      <Box w="full">
        <Text as="h2" fontSize="lg" mt={0} mb={0}>
          111
        </Text>
        <Text mt={2}>111</Text>
      </Box>
  )
}
export default function FrequentQuestions() {
  return (
      <>
        <Header/>
        <Box
          as="section"
          w="full"
          pb={12}
          pt={14}
          mx="auto"
          maxWidth="5xl"
          px={{ base: '2', md: '6' }}
        >
          <chakra.h1 mb={10}>
            Frequent Questions
          </chakra.h1>
          <VStack>
            <QuestionBox/>
          </VStack>
        </Box>
        </>

  )
}
