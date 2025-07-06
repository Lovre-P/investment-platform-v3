-- Create database schema for MegaInvest Platform

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Investments table
CREATE TABLE IF NOT EXISTS investments (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    long_description TEXT NOT NULL,
    amount_goal DECIMAL(15,2) NOT NULL,
    amount_raised DECIMAL(15,2) DEFAULT 0,
    currency VARCHAR(10) NOT NULL DEFAULT 'EUR',
    images JSON DEFAULT ('[]'),
    category VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending Approval',
    submitted_by VARCHAR(255) NOT NULL,
    submitter_email VARCHAR(255),
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    apy_range VARCHAR(50),
    min_investment DECIMAL(15,2),
    term VARCHAR(100),
    tags JSON DEFAULT ('[]'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    message TEXT NOT NULL,
    investment_id VARCHAR(36),
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'New',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (investment_id) REFERENCES investments(id) ON DELETE SET NULL
);

-- Investment Categories table
CREATE TABLE IF NOT EXISTS investment_categories (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Platform Settings table
CREATE TABLE IF NOT EXISTS platform_settings (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_investments_status ON investments(status);
CREATE INDEX idx_investments_category ON investments(category);
CREATE INDEX idx_investments_submission_date ON investments(submission_date);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_investment_id ON leads(investment_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_investment_categories_name ON investment_categories(name);
CREATE INDEX idx_investment_categories_active ON investment_categories(is_active);
CREATE INDEX idx_platform_settings_key ON platform_settings(setting_key);
CREATE INDEX idx_platform_settings_public ON platform_settings(is_public);

-- Insert default investment categories
INSERT IGNORE INTO investment_categories (id, name, description, sort_order) VALUES
(UUID(), 'Real Estate', 'Property investments, real estate development, and related opportunities', 1),
(UUID(), 'Technology', 'Tech startups, software companies, and technology-related investments', 2),
(UUID(), 'Renewable Energy', 'Solar, wind, and other sustainable energy projects', 3),
(UUID(), 'Small Business', 'Local businesses, franchises, and small-scale commercial ventures', 4),
(UUID(), 'Healthcare', 'Medical technology, healthcare services, and pharmaceutical investments', 5),
(UUID(), 'Agriculture', 'Farming, food production, and agricultural technology investments', 6),
(UUID(), 'Other', 'Miscellaneous investment opportunities not covered by other categories', 99);

-- Insert default platform settings
INSERT IGNORE INTO platform_settings (id, setting_key, setting_value, setting_type, description, is_public) VALUES
(UUID(), 'platform_name', 'MegaInvest Platform', 'string', 'The name of the investment platform', TRUE),
(UUID(), 'default_currency', 'EUR', 'string', 'Default currency for investments', TRUE),
(UUID(), 'admin_email', 'admin@megainvest.com', 'string', 'Primary admin email for notifications', FALSE),
(UUID(), 'maintenance_mode', 'false', 'boolean', 'Enable maintenance mode to restrict public access', FALSE),
(UUID(), 'enable_email_notifications', 'true', 'boolean', 'Enable system-wide email notifications', FALSE),
(UUID(), 'max_investment_images', '5', 'number', 'Maximum number of images per investment', FALSE),
(UUID(), 'min_investment_amount', '1000', 'number', 'Minimum investment amount in default currency', TRUE),
(UUID(), 'platform_fee_percentage', '2.5', 'number', 'Platform fee percentage for successful investments', FALSE),
(UUID(), 'allow_public_submissions', 'true', 'boolean', 'Allow public users to submit investment opportunities', FALSE),
(UUID(), 'require_admin_approval', 'true', 'boolean', 'Require admin approval for new investments', FALSE),
(UUID(), 'contact_email', 'contact@megainvest.com', 'string', 'Public contact email address', TRUE),
(UUID(), 'support_phone', '+1-555-0123', 'string', 'Public support phone number', TRUE),
(UUID(), 'company_address', '123 Investment St, Finance City, FC 12345', 'string', 'Company address for legal documents', FALSE),
(UUID(), 'terms_of_service_url', '/terms', 'string', 'URL to terms of service page', TRUE),
(UUID(), 'privacy_policy_url', '/privacy', 'string', 'URL to privacy policy page', TRUE),
(UUID(), 'enable_lead_notifications', 'true', 'boolean', 'Send email notifications for new leads', FALSE),
(UUID(), 'enable_investment_notifications', 'true', 'boolean', 'Send email notifications for new investment submissions', FALSE);
