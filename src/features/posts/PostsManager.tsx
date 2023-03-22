import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  List,
  ListIcon,
  ListItem,
  Spacer,
  Stat,
  StatLabel,
  StatNumber,
  useToast,
} from "@chakra-ui/react";
import { MdBook } from "react-icons/md";
import React, { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  Post,
  LoadingType,
  selectCount,
  getAllPosts,
} from "../../reducer/posts.slice";
import { addPost, fetchPosts } from "../../reducer/posts.extra";
import { PostDetail } from "./PostDetail";

const AddPost = () => {
  const dispatch = useAppDispatch();
  const initialValue = { name: "" };
  const [post, setPost] = useState<Pick<Post, "name">>(initialValue);
  // const [addPost, { isLoading }] = useAddPostMutation()
  const toast = useToast();

  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setPost((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
  };

  const handleAddPost = async () => {
    try {
      await dispatch(addPost(post));
      setPost(initialValue);
    } catch {
      toast({
        title: "An error occurred",
        description: "We couldn't save your post, try again!",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex p={5}>
      <Box flex={10}>
        <FormControl isInvalid={Boolean(post.name.length < 3 && post.name)}>
          <FormLabel htmlFor="name">Post name</FormLabel>
          <Input
            id="name"
            name="name"
            placeholder="Enter post name"
            value={post.name}
            onChange={handleChange}
          />
        </FormControl>
      </Box>
      <Spacer />
      <Box>
        <Button
          mt={8}
          colorScheme="purple"
          // isLoading={isLoading}
          onClick={handleAddPost}
        >
          Add Post
        </Button>
      </Box>
    </Flex>
  );
};

const PostList = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.posts.loading);
  const posts = useAppSelector(getAllPosts);
  const navigate = useNavigate();

  if (loading === LoadingType.idle) {
    dispatch(fetchPosts());
    return <div>Loading</div>;
  }

  if (loading === LoadingType.pending) {
    return <div>Loading</div>;
  }

  if (!posts) {
    return <div>No posts :(</div>;
  }

  return (
    <List spacing={3}>
      {posts.map(({ id, name }) => (
        <ListItem key={id} onClick={() => navigate(`/posts/${id}`)}>
          <ListIcon as={MdBook} color="green.500" /> {name}
        </ListItem>
      ))}
    </List>
  );
};

export const PostsCountStat = () => {
  const count = useAppSelector(selectCount);

  return (
    <Stat>
      <StatLabel>Active Posts</StatLabel>
      <StatNumber>{count}</StatNumber>
    </Stat>
  );
};

export const PostsManager = () => {
  return (
    <Box>
      <Flex bg="#011627" p={4} color="white">
        <Box>
          <Heading size="xl">Manage Posts</Heading>
        </Box>
        <Spacer />
        <Box>
          <PostsCountStat />
        </Box>
      </Flex>
      <Divider />
      <AddPost />
      <Divider />
      <Flex wrap="wrap">
        <Box flex={1} borderRight="1px solid #eee">
          <Box p={4} borderBottom="1px solid #eee">
            <Heading size="sm">Posts</Heading>
          </Box>
          <Box p={4}>
            <PostList />
          </Box>
        </Box>
        <Box flex={2}>
          <Routes>
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route
              element={
                <Center h="200px">
                  <Heading size="md">Select a post to edit!</Heading>
                </Center>
              }
            />
          </Routes>
        </Box>
      </Flex>
    </Box>
  );
};

export default PostsManager;
