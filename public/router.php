<?php
// Router for PHP's built-in development server
if (php_sapi_name() === 'cli-server') {
    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    
    // Serve static files from assets directory
    if (preg_match('/\.(?:css|js|jpg|jpeg|png|gif)$/', $path)) {
        $file = __DIR__ . $path;
        if (file_exists($file)) {
            $extension = pathinfo($file, PATHINFO_EXTENSION);
            $mime_types = [
                'css' => 'text/css',
                'js' => 'application/javascript',
                'jpg' => 'image/jpeg',
                'jpeg' => 'image/jpeg',
                'png' => 'image/png',
                'gif' => 'image/gif'
            ];
            
            if (isset($mime_types[$extension])) {
                header('Content-Type: ' . $mime_types[$extension]);
            }
            
            readfile($file);
            return true;
        }
    }
}

// Let PHP handle the rest
require __DIR__ . '/index.php';