# Use official PHP image
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

# Copy project files
COPY . .

# Install Composer (copy from Composer image)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Expose Render port
ENV PORT 10000

# Start PHP server
CMD ["php", "-S", "0.0.0.0:10000", "-t", "public"]
