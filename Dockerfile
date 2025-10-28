# Use official PHP image
FROM php:8.2-cli

# Install dependencies (optional: GD, PDO, etc.)
RUN apt-get update && apt-get install -y \
    libpng-dev libjpeg-dev libfreetype6-dev unzip git \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd

# Set working directory
WORKDIR /app

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copy all project files
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --prefer-dist --no-interaction

# Expose Render port
ENV PORT 10000

# Start PHP server
CMD ["php", "-S", "0.0.0.0:10000", "-t", "public"]
