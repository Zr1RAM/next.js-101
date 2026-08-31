import Link from "next/link";

const Nav = () => {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/contact">Contact</Link>
      <Link href="/blog">Blog</Link>
      <Link href="/marketing">Marketing</Link>
    </nav>
  );
};

export default Nav;