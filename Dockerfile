# Use official PHP CLI image
FROM php:8.2-cli

# Optional: install GD if needed for images
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd

# Set working directory
WORKDIR /app

# Copy Composer files first
COPY composer.json composer.lock ./

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
    && composer install --no-dev --optimize-autoloader --prefer-dist --no-scripts --no-interaction

# Copy the rest of the project
COPY . .

# Render expects this environment variable
ENV PORT 10000

# Start PHP server
CMD ["php", "-S", "0.0.0.0:10000", "-t", "public"]
