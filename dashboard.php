<?php
session_start();
require_once 'vendor/autoload.php';

use Twig\Environment;
use Twig\Loader\FilesystemLoader;

// Protect the page
if (!isset($_SESSION['user'])) {
    header('Location: ?page=login');
    exit;
}

$loader = new FilesystemLoader('templates');
$twig = new Environment($loader);

// For now, static values
$stats = [
    'total' => 12,
    'open' => 5,
    'resolved' => 4,
    'in_progress' => 3
];

// Render dashboard
echo $twig->render('dashboard.twig', [
    'user' => $_SESSION['user'],
    'stats' => $stats
]);
