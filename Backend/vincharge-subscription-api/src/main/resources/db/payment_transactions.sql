-- Create payment_transactions table for tracking payment history
CREATE TABLE IF NOT EXISTS vcs.payment_transactions (
    transaction_id SERIAL PRIMARY KEY,
    consumption_record_id BIGINT NOT NULL,
    transaction_reference VARCHAR(50) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    payment_method VARCHAR(50),
    response_code VARCHAR(10),
    response_message VARCHAR(255),
    bank_code VARCHAR(20),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP,
    CONSTRAINT fk_payment_transaction_consumption_record
        FOREIGN KEY (consumption_record_id)
        REFERENCES vcs.consumption_records (consumption_record_id)
);

-- Add index on transaction_reference for faster lookups
CREATE INDEX IF NOT EXISTS idx_payment_transaction_reference
    ON vcs.payment_transactions (transaction_reference);

-- Add index on consumption_record_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_payment_consumption_record_id
    ON vcs.payment_transactions (consumption_record_id);
