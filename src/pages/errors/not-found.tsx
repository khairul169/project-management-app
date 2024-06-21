import Button from "@/components/ui/button";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <main className="flex flex-col items-center text-center">
        <h1 className="text-9xl font-extrabold">404</h1>
        <p className="text-2xl font-medium">Page Not Found</p>

        <div className="mt-6">
          <Button href="/">Go home</Button>
        </div>
      </main>
    </div>
  );
};

export default NotFoundPage;
