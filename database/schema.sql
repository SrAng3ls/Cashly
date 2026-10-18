CREATE DATABASE IF NOT EXISTS cashly CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cashly;
CREATE TABLE IF NOT EXISTS users (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100) NOT NULL, email VARCHAR(190) NOT NULL UNIQUE,
 password_hash VARCHAR(255) NOT NULL, phone VARCHAR(30) NULL, avatar VARCHAR(255) NULL,
 role ENUM('user','admin') NOT NULL DEFAULT 'user', status ENUM('active','inactive') NOT NULL DEFAULT 'active',
 theme ENUM('light','blue','dark') NOT NULL DEFAULT 'blue', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 last_login DATETIME NULL
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS movements (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, user_id BIGINT UNSIGNED NOT NULL,
 type ENUM('income','expense') NOT NULL, amount DECIMAL(14,2) NOT NULL, category VARCHAR(80) NOT NULL,
 payment_method VARCHAR(50) NOT NULL DEFAULT 'Efectivo', movement_date DATE NOT NULL,
 description VARCHAR(255) NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 INDEX idx_mov_user_date(user_id,movement_date), CONSTRAINT fk_mov_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS savings_goals (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, user_id BIGINT UNSIGNED NOT NULL, name VARCHAR(120) NOT NULL,
 target_amount DECIMAL(14,2) NOT NULL, initial_amount DECIMAL(14,2) NOT NULL DEFAULT 0, deadline DATE NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, CONSTRAINT fk_goal_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS goal_deposits (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, goal_id BIGINT UNSIGNED NOT NULL, user_id BIGINT UNSIGNED NOT NULL,
 amount DECIMAL(14,2) NOT NULL, deposit_date DATE NOT NULL, note VARCHAR(255) NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT fk_deposit_goal FOREIGN KEY(goal_id) REFERENCES savings_goals(id) ON DELETE CASCADE,
 CONSTRAINT fk_deposit_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS budgets (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, user_id BIGINT UNSIGNED NOT NULL, name VARCHAR(120) NOT NULL,
 limit_amount DECIMAL(14,2) NOT NULL, period ENUM('weekly','monthly','yearly') NOT NULL DEFAULT 'monthly', category VARCHAR(80) NOT NULL,
 initial_spent DECIMAL(14,2) NOT NULL DEFAULT 0, start_date DATE NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT fk_budget_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS budget_expenses (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, budget_id BIGINT UNSIGNED NOT NULL, user_id BIGINT UNSIGNED NOT NULL,
 amount DECIMAL(14,2) NOT NULL, expense_date DATE NOT NULL, description VARCHAR(255) NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT fk_be_budget FOREIGN KEY(budget_id) REFERENCES budgets(id) ON DELETE CASCADE,
 CONSTRAINT fk_be_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS reminders (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, user_id BIGINT UNSIGNED NOT NULL, title VARCHAR(160) NOT NULL,
 event_type ENUM('payment','subscription','reminder') NOT NULL DEFAULT 'payment', event_date DATE NOT NULL, event_time TIME NULL,
 amount DECIMAL(14,2) NOT NULL DEFAULT 0, notes VARCHAR(255) NULL, recurring TINYINT(1) NOT NULL DEFAULT 0,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, CONSTRAINT fk_reminder_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS articles (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, title VARCHAR(180) NOT NULL, category VARCHAR(80) NOT NULL DEFAULT 'Educación financiera',
 image_url VARCHAR(500) NULL, body MEDIUMTEXT NOT NULL, published TINYINT(1) NOT NULL DEFAULT 0, author_id BIGINT UNSIGNED NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, CONSTRAINT fk_article_author FOREIGN KEY(author_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS support_tickets (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, user_id BIGINT UNSIGNED NOT NULL, type VARCHAR(40) NOT NULL DEFAULT 'soporte',
 subject VARCHAR(180) NOT NULL, message TEXT NOT NULL, reply_text TEXT NULL, replied_at DATETIME NULL, status ENUM('open','in_progress','closed') NOT NULL DEFAULT 'open',
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, CONSTRAINT fk_ticket_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
INSERT INTO articles(title,category,body,published) SELECT '5 hábitos para ahorrar aunque ganes poco','Ahorro','Registra tus gastos, define una meta concreta, separa una cantidad pequeña al recibir dinero y revisa tus avances semanalmente. No necesitas empezar con mucho: necesitas un hábito que puedas mantener.',1 WHERE NOT EXISTS (SELECT 1 FROM articles WHERE title='5 hábitos para ahorrar aunque ganes poco');
INSERT INTO articles(title,category,body,published) SELECT 'Cómo crear un presupuesto realista','Presupuesto','Anota tus ingresos y gastos esenciales. Define límites que se adapten a tu realidad, reserva una cantidad para imprevistos y revisa el presupuesto cada semana. Ajustarlo no es fracasar: es aprender.',1 WHERE NOT EXISTS (SELECT 1 FROM articles WHERE title='Cómo crear un presupuesto realista');
INSERT INTO articles(title,category,body,published) SELECT 'Errores financieros que puedes evitar','Educación financiera','Evita comprar por impulso, compara precios, lee las condiciones de los créditos y conserva un fondo para imprevistos. Antes de endeudarte, calcula si la cuota cabe en tu presupuesto.',1 WHERE NOT EXISTS (SELECT 1 FROM articles WHERE title='Errores financieros que puedes evitar');

INSERT INTO articles(title,category,body,published) SELECT 'Cómo evitar las compras impulsivas','Gastos','Antes de comprar, espera unos minutos y pregúntate si lo necesitas, si cabe en tu presupuesto y si existe una alternativa más económica. Anotar tus gastos ayuda a reconocer patrones sin juzgarte.',1 WHERE NOT EXISTS (SELECT 1 FROM articles WHERE title='Cómo evitar las compras impulsivas');
INSERT INTO articles(title,category,body,published) SELECT 'Primeros pasos para entender las inversiones','Inversiones','Antes de invertir, aprende la diferencia entre riesgo y rentabilidad, define para qué necesitas el dinero y evita invertir fondos que necesitas para gastos esenciales. Desconfía de las ganancias garantizadas y verifica que la entidad esté autorizada.',1 WHERE NOT EXISTS (SELECT 1 FROM articles WHERE title='Primeros pasos para entender las inversiones');

-- Si la tabla support_tickets ya existía antes de esta versión, ejecutar una sola vez:
-- ALTER TABLE support_tickets ADD COLUMN reply_text TEXT NULL, ADD COLUMN replied_at DATETIME NULL;
