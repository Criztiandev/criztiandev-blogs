import React, { PropsWithChildren } from "react";

const BlogLayoutPage = ({ children }: PropsWithChildren) => {
  return <div className="overflow-auto">{children}</div>;
};

export default BlogLayoutPage;
