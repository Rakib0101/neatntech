import { useState, useMemo } from 'react';
import ServiceProjectsData from '../../assets/jsonData/projects/ServiceProjectsData.json';
import '../../assets/css/service-projects-filter.css';

export interface ProjectItem {
    id: number;
    serviceIds?: number[] | string;
    title: string;
    category: string;
    subtitle: string;
    features: string[];
    image: string;
    link?: string;
    linkLabel?: string;
}

interface ServiceProjectsFilterProps {
    serviceId?: number | string;
    serviceTitle?: string;
    customTitle?: string;
    sectionClass?: string;
}

const ServiceProjectsFilter = ({
    serviceId,
    serviceTitle,
    customTitle,
    sectionClass = ""
}: ServiceProjectsFilterProps) => {

    const [activeCategory, setActiveCategory] = useState<string>('All');

    // Filter projects relevant to the current service, or all if none specified
    const availableProjects: ProjectItem[] = useMemo(() => {
        const allData = ServiceProjectsData as ProjectItem[];
        if (!serviceId) {
            return allData;
        }

        const numericId = typeof serviceId === 'string' ? parseInt(serviceId, 10) : serviceId;
        const filtered = allData.filter(item => {
            if (!item.serviceIds || item.serviceIds === 'all') return true;
            if (Array.isArray(item.serviceIds)) {
                return item.serviceIds.includes(numericId);
            }
            return true;
        });

        // Fallback to all data if none matched
        return filtered.length > 0 ? filtered : allData;
    }, [serviceId]);

    // Dynamically derive category pills from the available projects
    const categories: string[] = useMemo(() => {
        const uniqueCategories = Array.from(
            new Set(availableProjects.map(item => item.category))
        );
        return ['All', ...uniqueCategories];
    }, [availableProjects]);

    // Filter by the active category tab
    const displayedProjects = useMemo(() => {
        if (activeCategory === 'All') {
            return availableProjects;
        }
        return availableProjects.filter(item => item.category === activeCategory);
    }, [availableProjects, activeCategory]);

    // Compute heading
    const headingText = useMemo(() => {
        if (customTitle) return customTitle;
        if (serviceTitle) {
            // If serviceTitle contains "Shopify", or similar, e.g. "Selected Shopify Projects"
            return `Selected ${serviceTitle} Projects`;
        }
        return "Selected Projects";
    }, [customTitle, serviceTitle]);

    return (
        <div className={`services-projects-area ${sectionClass}`}>
            <div className="services-projects-header">
                <h2 className="services-projects-title">{headingText}</h2>

                {/* Filter Tabs / Pills */}
                <div className="services-filter-tabs">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            className={`service-filter-btn ${activeCategory === cat ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Projects Grid */}
            <div className="services-projects-grid">
                {displayedProjects.map((project, index) => (
                    <div
                        className="service-project-card-wrapper"
                        key={`${activeCategory}-${project.id}`}
                        style={{ animationDelay: `${index * 0.05}s` }}
                    >
                        <div className="service-project-card">
                            {/* Card Image */}
                            <div className="project-card-thumb">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    loading="lazy"
                                />
                            </div>

                            {/* Card Content */}
                            <div className="project-card-content">
                                <div className="project-card-header-row">
                                    <h3 className="project-card-title">{project.title}</h3>
                                    <span className="project-card-category">{project.category}</span>
                                </div>

                                <p className="project-card-subtitle">{project.subtitle}</p>

                                {/* Features List */}
                                <ul className="project-card-features">
                                    {project.features.map((feature, fIdx) => (
                                        <li key={fIdx} className="project-feature-item">
                                            <span className="dash">—</span>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA Link */}
                                <div className="project-card-link-wrapper">
                                    <a
                                        href={project.link || "#"}
                                        className="project-card-link"
                                        target={project.link?.startsWith('http') ? "_blank" : "_self"}
                                        rel="noopener noreferrer"
                                    >
                                        {project.linkLabel || "View Store"} <span className="arrow">→</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ServiceProjectsFilter;
