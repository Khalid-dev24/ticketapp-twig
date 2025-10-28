# Use official PHP CLI image
FROM php:8.2-cli

# Install GD (optional)
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd

# Set working directory
WORKDIR /app

# Copy composer files first
COPY composer.json composer.lock ./

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Install PHP dependencies (fresh)
RUN composer clear-cache \
    && composer install --no-dev --optimize-autoloader --prefer-dist --no-scripts --no-interaction

# Copy rest of the project
COPY . .

# Expose Render port
ENV PORT 10000

# Start PHP built-in server
CMD ["php", "-S", "0.0.0.0:10000", "-t", "public"]
