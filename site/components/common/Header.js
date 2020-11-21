import {
  chakra,
  Flex,
  HStack,
  Text,
} from "@chakra-ui/react"
import NavLink from "./HeaderNavLink";

function HeaderContent(props) {
  return (
      <Flex w="100%" h="100%" px="10" align="center">
        <Text fontSize="lg" fontWeight="200">
          Stack
        </Text>
        <Text fontSize="lg" fontWeight="bold" color="brand.500">
          UnderFlow
        </Text>
        <HStack
            as="nav"
            spacing="4"
            ml="24px"
            display={{ base: "none", md: "flex" }}
        >
          <NavLink href="/docs/getting-started">Questions</NavLink>
        </HStack>
      </Flex>
  )
}

function Header(props) {
  return (
      <chakra.header
          pos="fixed"
          top="0"
          zIndex="1"
          left="0"
          right="0"
          borderTop="6px solid"
          borderTopColor="brand.400"
          width="full"
          {...props}
      >
        <chakra.div height="4.5rem" mx="auto" maxW="1200px">
          <HeaderContent />
        </chakra.div>
      </chakra.header>
  )
}
export default Header
