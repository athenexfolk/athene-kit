import { Button, Container, Flex, Icon, Stack } from './ui';
import ButtonExamples from './ui/examples/button.example';
import DropdownExamples from './ui/examples/dropdown.example';
import LayoutExamples from './ui/examples/layout.example';

export default function App() {
  return (
    <>
      <Container
        maxWidth={600}
        p={6}
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Stack gap={6}>
          <Flex align="center" justify="center" gap={2}>
            <Icon name="star" size={40} />
            <h1 style={{ margin: 0, fontSize: 32 }}>Welcome to Athene Kit</h1>
          </Flex>
          <p style={{ textAlign: 'center', fontSize: 18, color: '#444' }}>
            A modern UI kit for building beautiful web apps with React.
          </p>
          <Flex gap={2} justify="center">
            <Button variant="primary" size="lg">
              Get Started
            </Button>
            <Button variant="secondary" size="lg">
              Docs
            </Button>
          </Flex>
        </Stack>
      </Container>
      <Container p={6}>
        <LayoutExamples />
        <ButtonExamples />
        <DropdownExamples />
      </Container>
    </>
  );
}
