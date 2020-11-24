import { Box } from '@chakra-ui/react';
import Header from './Header';

function PageContainer() {
  return (
    <>
      <Header />
      <Box
        w="full"
        pb={12}
        pt={3}
        maxWidth="1200px"
        px={{ base: '2', md: '6' }}
      >

      </Box>
    </>
  );
}

export default PageContainer;
