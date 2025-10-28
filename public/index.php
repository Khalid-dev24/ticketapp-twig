<?php
session_start();

require_once __DIR__ . '/../vendor/autoload.php';

use Twig\Environment;
use Twig\Loader\FilesystemLoader;

// Twig loader pointing to templates folder
$loader = new FilesystemLoader(__DIR__ . '/../templates');
$twig = new Environment($loader);

// Simple routing example
$page = $_GET['page'] ?? 'home';

switch ($page) {
    case 'login':
        echo $twig->render('login.twig');
        break;

    case 'signup':
        echo $twig->render('signup.twig');
        break;

    case 'home':
    default:
        echo $twig->render('home.twig');
        break;
}
