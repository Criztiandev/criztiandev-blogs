import React, { PropsWithChildren } from "react";

const BlogLayoutPage = ({ children }: PropsWithChildren) => {
  return <div className="overflow-hidden">{children}</div>;
};

export default BlogLayoutPage;
