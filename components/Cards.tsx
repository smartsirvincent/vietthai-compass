import Link from "next/link";
import { ArrowRight, BadgeCheck, BriefcaseBusiness, MapPin } from "lucide-react";
import { Article, City, DirectoryBusiness } from "@/lib/types";

export function SectionHeader({
  eyebrow,
  title,
  intro,
  href
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  href?: string;
}) {
  return (
    <div className="section-header">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
        {intro ? <p>{intro}</p> : null}
      </div>
      {href ? (
        <Link className="text-link" href={href}>
          查看更多 <ArrowRight size={16} />
        </Link>
      ) : null}
    </div>
  );
}

export function CityCard({ city }: { city: City }) {
  return (
    <Link className="card city-card has-image" href={`/cities/${city.slug}`} aria-label={`查看${city.name}指南`}>
      <img src={city.image} alt={`${city.name}城市指南`} />
      <div className="article-card-body">
        <span className="pill">{city.country === "vietnam" ? "越南" : "泰國"}</span>
        <h3>{city.name}</h3>
        <p>{city.summary}</p>
        <dl>
          <div>
            <dt>季節</dt>
            <dd>{city.bestSeason}</dd>
          </div>
          <div>
            <dt>天數</dt>
            <dd>{city.recommendedDays}</dd>
          </div>
        </dl>
      </div>
    </Link>
  );
}

export function CategoryVisualCard({
  title,
  intro,
  image,
  alt,
  href
}: {
  title: string;
  intro: string;
  image: string;
  alt: string;
  href: string;
}) {
  return (
    <Link className="card article-card has-image" href={href} aria-label={`查看${title}`}>
      <img src={image} alt={alt} />
      <div className="article-card-body">
        <span className="pill">分類</span>
        <h3>{title}</h3>
        <p>{intro}</p>
      </div>
    </Link>
  );
}

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link className="card article-card has-image" href={`/articles/${article.slug}`} aria-label={`閱讀${article.title}`}>
      <img src={article.coverImage} alt={article.photoAlt || article.title} />
      <div className="article-card-body">
        <span className="pill">{article.category}</span>
        <h3>{article.title}</h3>
        <p>{article.excerpt}</p>
        <div className="keyword-row">
          {article.keywords.slice(0, 3).map((keyword) => (
            <span key={keyword}>{keyword}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export function BusinessCard({ business }: { business: DirectoryBusiness }) {
  return (
    <Link className={`card business-card ${business.image ? "has-image" : ""}`} href={`/directory/${business.slug}`} aria-label={`查看${business.name}`}>
      {business.image ? (
        <img src={business.image} alt={`${business.name}商家照片`} />
      ) : (
        <div className="card-icon">
          <BriefcaseBusiness size={20} />
        </div>
      )}
      <span className="pill">{business.category}</span>
      <h3>{business.name}</h3>
      <p>{business.description}</p>
      <div className="badge-row">
        {business.isTaiwanBusiness ? (
          <span>
            <BadgeCheck size={14} /> 台商專區
          </span>
        ) : null}
        {business.badges.map((badge) => (
          <span key={badge}>
            <BadgeCheck size={14} /> {badge}
          </span>
        ))}
      </div>
    </Link>
  );
}

export function InfoStrip({ items }: { items: Array<[string, string]> }) {
  return (
    <div className="info-strip">
      {items.map(([label, value]) => (
        <div key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </div>
  );
}

export function LocationNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="location-note">
      <MapPin size={18} />
      <span>{children}</span>
    </div>
  );
}
