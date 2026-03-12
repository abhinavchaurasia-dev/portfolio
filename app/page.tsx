import Hero from "@/components/home/Hero";
import ProjectCard from "@/components/work/ProjectCard";
import PageWrapper from "@/components/layout/PageWrapper";

export default function HomePage() {
  return (
    <PageWrapper>
      <Hero />
      <ProjectCard
        title="Northern Railway Portal"
        status="PRODUCTION"
        year="2025"
        type="Full-Stack"
        description="Trainee management portal digitizing registration, attendance tracking, and certificate generation for Northern Railway WTC."
        architecture="Layered API (routes → controllers → services) · PostgreSQL · React MUI"
        tags={["Node.js", "Express", "PostgreSQL", "React", "MUI"]}
        caseStudyHref="/work/northern-railway"
      />
    </PageWrapper>
  );
}
