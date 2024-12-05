"use server";
import cn from "classnames";
export default async function PageTitle({
  subtitle,
  className
}: Readonly<{ subtitle?: string, className?: string }>) {

  const headClassName = cn("page-title heading", {
    [`${className}`]: className,
  });

  return (
    <>
      <h1 className={headClassName}>Timetables</h1>
      {!!subtitle && <h2 className="subheading">{subtitle}</h2>}
    </>
  );
}
