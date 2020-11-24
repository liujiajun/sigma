import { Box, Container } from '@chakra-ui/react';
import { Context, Text } from 'react-mathjax2';

export default function LatexAndHtml({ raw }) {
  return (
    <Box w="100%">
      <Context
        options={{
          asciimath2jax: {
            useMathMLspacing: true,
            delimiters: [['$', '$']],
            preview: 'none',
          },
        }}
      >
        <Text text={<div dangerouslySetInnerHTML={{ __html: raw }} />} />
      </Context>
    </Box>
  );
}
