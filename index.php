<?php
require_once __DIR__ . '/vendor/autoload.php';

use Twig\Environment;
use Twig\Loader\FilesystemLoader;

$loader = new FilesystemLoader(__DIR__ . '/templates');
$twig = new Environment($loader);

// Simple route handler using ?page=...
$page = $_GET['page'] ?? 'landing';

switch ($page) {
    case 'login':
        echo $twig->render('login.twig');
        break;
    case 'signup':
        echo $twig->render('signup.twig');
        break;
    case 'dashboard':
        echo $twig->render('dashboard.twig');
        break;
    case 'tickets':
        echo $twig->render('tickets.twig');
        break;
    default:
        echo $twig->render('home.twig');
        break;
}
