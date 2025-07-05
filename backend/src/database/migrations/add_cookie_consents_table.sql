CREATE TABLE IF NOT EXISTS cookie_consents (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36) NULL,
  session_id VARCHAR(255) NULL,
  strictly_necessary BOOLEAN DEFAULT TRUE NOT NULL,
  functional BOOLEAN DEFAULT FALSE NOT NULL,
  analytics BOOLEAN DEFAULT FALSE NOT NULL,
  marketing BOOLEAN DEFAULT FALSE NOT NULL,
  consent_version VARCHAR(10) NOT NULL DEFAULT '1.0',
  ip_address VARCHAR(45) NULL,
  user_agent TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_session_id (session_id),
  INDEX idx_created_at (created_at),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
