<?php
// Root-level public API proxy to backend routes
// This allows calls to /api/index.php regardless of whether pages are under / or /public

require_once realpath(__DIR__ . '/../backend/api/routes.php');
