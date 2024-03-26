import { Stack } from "@chakra-ui/layout";
import { Skeleton } from "@chakra-ui/react";
import React from "react";

const ChatLoading = ({ loading }) => {
  return (
    <Stack padding={4} spacing={1}>
      <Skeleton height='40px' loading={loading.toString()}>
      </Skeleton>
      <Skeleton
        height='40px'
        loading={loading.toString()}
        bg='green.500'
        color='blue.500'
        fadeDuration={1}
      >
      </Skeleton>
      <Skeleton
        height='40px'
        loading={loading.toString()}
        fadeDuration={4}
        bg='blue.500'
        color='white'
      >
      </Skeleton>
    </Stack>
  )
}
export default ChatLoading;
