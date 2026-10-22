/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

/** Лого BBS: знак 104.375×40.102, синий разделитель 2px, красная подпись. */
export default function Logo() {
  return (
    <Link href="/" className="flex h-[40px] w-[203px] shrink-0 items-center gap-[4px]">
      <img
        src="/figma/bbs/bbs-logo.png"
        alt="BBS"
        width={104}
        height={40}
        className="block shrink-0 object-cover"
        style={{ width: "104.375px", height: "40.102px" }}
      />
      <div className="h-[40px] w-[2px] shrink-0 bg-[#1460ad]" />
      <div className="shrink-0 whitespace-nowrap text-[16px] font-medium text-[#e52b34]">
        <p className="leading-[20px]">EXCLUSIVE</p>
        <p className="leading-[20px]">SURFACE</p>
      </div>
    </Link>
  );
}
