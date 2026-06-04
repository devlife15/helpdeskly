// I'm using this component just to center auth related UI's

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen min-w-screen h-full flex justify-center items-center">
      {children}
    </div>
  );
};
