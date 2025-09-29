<?php
// Frontend folder API proxy to backend routes
// Supports deployments that serve /frontend as the document root.

require_once realpath(__DIR__ . '/../../backend/api/routes.php');
