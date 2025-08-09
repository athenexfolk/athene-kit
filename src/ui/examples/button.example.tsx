import Button from '../components/button';

export default function ButtonExamples() {
  return (
    <div className="flex flex-col gap-4 p-8">
      <div className="flex flex-wrap items-start gap-4">
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button disabled>Disabled</Button>
        <Button loading loadingText="Loading...">
          Loading
        </Button>
      </div>
      <div className="flex flex-wrap items-start gap-4">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </div>
      <div className="flex flex-wrap items-start gap-4">
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
      </div>
    </div>
  );
}
