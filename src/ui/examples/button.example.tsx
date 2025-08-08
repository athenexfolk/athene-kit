import Button from '../components/button';
import { Container, Flex } from '../layout/primitives';

export default function ButtonExamples() {
  return (
    <Container
      p={4}
      style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
    >
      <Flex gap={2} align="start">
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button disabled>Disabled</Button>
        <Button loading loadingText="Loading...">
          Loading
        </Button>
      </Flex>
      <Flex gap={2} align="start">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </Flex>
      <Flex gap={2} align="start">
        <Button icon="home">Home</Button>
        <Button icon="search" variant="secondary">
          Search
        </Button>
        <Button icon="arrow_forward" iconPosition="right">
          Next
        </Button>
        <Button icon="info" ariaLabel="Info" />
        <Button icon="download" loading loadingText="Downloading...">
          Download
        </Button>
      </Flex>
    </Container>
  );
}
