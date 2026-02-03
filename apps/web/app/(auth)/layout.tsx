const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen min-w-screen h-full flex justify-center items-center">
      {children}
    </div>
  );
};

export default Layout;
