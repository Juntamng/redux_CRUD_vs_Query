import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Center,
  CloseButton,
  Flex,
  Heading,
  Input,
  Spacer,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { getPostById, LoadingType } from "../../reducer/posts.slice";
import { deletePost, updatePost } from "../../reducer/posts.extra";

const EditablePostName = ({
  name: initialName,
  onUpdate,
  onCancel,
  isLoading = false,
}: {
  name: string;
  onUpdate: (name: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}) => {
  const [name, setName] = useState(initialName);

  const handleChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => setName(value);

  const handleUpdate = () => onUpdate(name);
  const handleCancel = () => onCancel();

  return (
    <Flex>
      <Box flex={10}>
        <Input
          type="text"
          onChange={handleChange}
          value={name}
          disabled={isLoading}
        />
      </Box>
      <Spacer />
      <Box>
        <Stack spacing={4} direction="row" align="center">
          <Button onClick={handleUpdate} isLoading={isLoading}>
            Update
          </Button>
          <CloseButton bg="red" onClick={handleCancel} disabled={isLoading} />
        </Stack>
      </Box>
    </Flex>
  );
};

const PostJsonDetail = ({ id }: { id: string }) => {
  const post = useAppSelector(getPostById(id));

  return (
    <Box mt={5} bg="#eee">
      <pre>{JSON.stringify(post, null, 2)}</pre>
    </Box>
  );
};

export const PostDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: any }>();
  const dispatch = useAppDispatch();
  const post = useAppSelector(getPostById(id));
  const isPending =
    useAppSelector((state) => state.posts.loading) === LoadingType.pending;
  const toast = useToast();

  const [isEditing, setIsEditing] = useState(false);

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return (
      <Center h="200px">
        <Heading size="md">
          Post {id} is missing! Try reloading or selecting another post...
        </Heading>
      </Center>
    );
  }

  return (
    <Box p={4}>
      {isEditing ? (
        <EditablePostName
          name={post.name}
          onUpdate={async (name) => {
            try {
              dispatch(updatePost({ id, name }));
              // await updatePost({ id, name }).unwrap()
            } catch {
              toast({
                title: "An error occurred",
                description: "We couldn't save your changes, try again!",
                status: "error",
                duration: 2000,
                isClosable: true,
              });
            } finally {
              setIsEditing(false);
            }
          }}
          onCancel={() => setIsEditing(false)}
          isLoading={isPending}
        />
      ) : (
        <Flex>
          <Box>
            <Heading size="md">{post.name}</Heading>
          </Box>
          <Spacer />
          <Box>
            <Stack spacing={4} direction="row" align="center">
              <Button onClick={() => setIsEditing(true)} disabled={isPending}>
                {isPending ? "Updating..." : "Edit"}
              </Button>
              <Button
                onClick={async () => {
                  await dispatch(deletePost(id));
                  navigate("/posts");
                }}
                disabled={isPending}
                colorScheme="red"
              >
                {isPending ? "Deleting..." : "Delete"}
              </Button>
            </Stack>
          </Box>
        </Flex>
      )}
      <PostJsonDetail id={post.id} />
    </Box>
  );
};
