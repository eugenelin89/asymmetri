import { motion } from "@/content/site";

export function MotionAccess({ id }: { id: string }) {
  return (
    <div className="motion-access">
      <a
        className="button button--primary"
        href={motion.access.path}
        aria-describedby={id}
      >
        {motion.access.label}
      </a>
      <div id={id} className="motion-access__details">
        <p>{motion.access.eligibility}</p>
        <p>{motion.access.note}</p>
      </div>
    </div>
  );
}
