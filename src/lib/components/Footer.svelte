<script lang="ts">
	const currentYear = new Date().getFullYear();
	const version = '0.1.0';
</script>

<footer class="bg-white border-t border-gray-200 mt-auto">
	<div class="py-4 px-4 sm:px-6">
		<div class="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-gray-500">
			<p>&copy; {currentYear} Dwello. Alle Rechte vorbehalten.</p>
			<div class="flex items-center gap-4">
				<span>v{version}</span>
				<span class="hidden sm:inline">|</span>
				<a href="/privacy" class="hover:text-gray-700" data-testid="footer-link">Datenschutz</a>
				<a href="/terms" class="hover:text-gray-700" data-testid="footer-link"
					>Nutzungsbedingungen</a
				>
			</div>
		</div>
	</div>
</footer>
