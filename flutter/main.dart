import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

// ============================================================
// 🔑 PEGÁ TU API KEY DE GEMINI ACÁ
const String _geminiApiKey = 'TU_API_KEY_ACA';
// ============================================================

const String _geminiUrl =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=$_geminiApiKey';

const String _systemPrompt = '''
Sos un clasificador de inventario de supermercado.
Recibís texto desordenado y extraés SOLO productos físicos que se venden en un súper.
Ignorá verbos, lugares, muletillas.
Devolvé SOLO un JSON válido con esta estructura exacta, sin markdown:
{"productos":[{"producto":"Nombre","cantidad":"1","unidad":"unidad","marca":"Genérica"}]}
Si no hay productos válidos: {"productos":[]}
''';

void main() => runApp(const DuoApp());

class DuoApp extends StatelessWidget {
  const DuoApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Cerebro Dúo',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorSchemeSeed: Colors.red,
        useMaterial3: true,
        brightness: Brightness.light,
      ),
      home: const DuoHome(),
    );
  }
}

class Producto {
  final String nombre;
  final String cantidad;
  final String unidad;
  final String marca;

  Producto({
    required this.nombre,
    required this.cantidad,
    required this.unidad,
    required this.marca,
  });

  factory Producto.fromJson(Map<String, dynamic> json) {
    return Producto(
      nombre: json['producto'] ?? 'Sin nombre',
      cantidad: json['cantidad']?.toString() ?? '1',
      unidad: json['unidad'] ?? 'unidad',
      marca: json['marca'] ?? 'Genérica',
    );
  }
}

class DuoHome extends StatefulWidget {
  const DuoHome({super.key});

  @override
  State<DuoHome> createState() => _DuoHomeState();
}

class _DuoHomeState extends State<DuoHome> {
  final TextEditingController _controller = TextEditingController();
  final List<Producto> _productos = [];
  bool _loading = false;
  String? _error;

  final List<String> _textosPrueba = [
    'Buscame leche, pan lactal y manteca para el desayuno',
    'Necesito fideos, salsa de tomate y queso rallado',
    'Traeme yerba, azúcar y galletitas de agua',
    'Poneme pollo, papas y cebolla para la cena',
  ];
  int _testIndex = 0;

  Future<void> _procesarTexto(String texto) async {
    if (texto.trim().isEmpty) return;

    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      final response = await http.post(
        Uri.parse(_geminiUrl),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'contents': [
            {
              'parts': [
                {'text': '$_systemPrompt\n\nTexto del usuario: $texto'}
              ]
            }
          ],
          'generationConfig': {
            'temperature': 0.1,
            'maxOutputTokens': 512,
          }
        }),
      );

      if (response.statusCode != 200) {
        throw Exception('Error ${response.statusCode}: ${response.body.substring(0, 200)}');
      }

      final data = jsonDecode(response.body);
      final rawText = data['candidates']?[0]?['content']?['parts']?[0]?['text'] ?? '{}';

      // Extraer JSON del texto
      final match = RegExp(r'\{[\s\S]*\}').firstMatch(rawText);
      if (match == null) throw Exception('No se encontró JSON en la respuesta');

      final parsed = jsonDecode(match.group(0)!);
      final List<dynamic> lista = parsed['productos'] ?? [];

      setState(() {
        for (final item in lista) {
          _productos.insert(0, Producto.fromJson(item));
        }
        _loading = false;
        _controller.clear();
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _loading = false;
      });
    }
  }

  void _simularDictado() {
    final texto = _textosPrueba[_testIndex % _textosPrueba.length];
    _testIndex++;
    _controller.text = texto;
    _procesarTexto(texto);
  }

  void _limpiarLista() {
    setState(() {
      _productos.clear();
      _error = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;

    return Scaffold(
      backgroundColor: cs.surface,
      appBar: AppBar(
        backgroundColor: cs.error,
        foregroundColor: cs.onError,
        title: const Row(
          children: [
            Icon(Icons.smart_toy, size: 28),
            SizedBox(width: 8),
            Text('Cerebro Dúo', style: TextStyle(fontWeight: FontWeight.w900)),
          ],
        ),
        actions: [
          if (_productos.isNotEmpty)
            IconButton(
              icon: const Icon(Icons.delete_sweep),
              onPressed: _limpiarLista,
              tooltip: 'Limpiar lista',
            ),
        ],
      ),
      body: Column(
        children: [
          // ── Barra de entrada ──
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: cs.surfaceContainerHighest,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.08),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Column(
              children: [
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _controller,
                        decoration: InputDecoration(
                          hintText: '¿Qué querés comprar?',
                          filled: true,
                          fillColor: cs.surface,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(16),
                            borderSide: BorderSide.none,
                          ),
                          contentPadding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 14,
                          ),
                          prefixIcon: Icon(Icons.search, color: cs.onSurfaceVariant),
                        ),
                        onSubmitted: _procesarTexto,
                        textInputAction: TextInputAction.send,
                      ),
                    ),
                    const SizedBox(width: 8),
                    // Botón micrófono (visual, no funcional en Zapp)
                    Container(
                      decoration: BoxDecoration(
                        color: cs.error,
                        shape: BoxShape.circle,
                      ),
                      child: IconButton(
                        icon: Icon(Icons.mic, color: cs.onError, size: 28),
                        onPressed: () => _procesarTexto(_controller.text),
                        tooltip: 'Enviar texto',
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                // Botón simular dictado
                SizedBox(
                  width: double.infinity,
                  child: FilledButton.icon(
                    onPressed: _loading ? null : _simularDictado,
                    icon: const Icon(Icons.record_voice_over),
                    label: const Text('Simular Dictado'),
                    style: FilledButton.styleFrom(
                      backgroundColor: cs.tertiary,
                      foregroundColor: cs.onTertiary,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),

          // ── Loading ──
          if (_loading)
            Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                  SizedBox(
                    width: 48,
                    height: 48,
                    child: CircularProgressIndicator(
                      strokeWidth: 4,
                      color: cs.error,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'Procesando con IA...',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: cs.onSurfaceVariant,
                    ),
                  ),
                ],
              ),
            ),

          // ── Error ──
          if (_error != null)
            Container(
              margin: const EdgeInsets.all(12),
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: cs.errorContainer,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  Icon(Icons.error_outline, color: cs.error),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      _error!,
                      style: TextStyle(color: cs.onErrorContainer, fontSize: 13),
                    ),
                  ),
                ],
              ),
            ),

          // ── Lista de productos ──
          Expanded(
            child: _productos.isEmpty && !_loading
                ? Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.shopping_cart_outlined,
                            size: 64, color: cs.outlineVariant),
                        const SizedBox(height: 12),
                        Text(
                          'Tu lista está vacía',
                          style: TextStyle(
                            fontSize: 18,
                            color: cs.onSurfaceVariant,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Tocá "Simular Dictado" para probar',
                          style: TextStyle(fontSize: 14, color: cs.outline),
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(12),
                    itemCount: _productos.length,
                    itemBuilder: (context, index) {
                      final p = _productos[index];
                      return Card(
                        margin: const EdgeInsets.only(bottom: 8),
                        elevation: 1,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                        ),
                        child: ListTile(
                          contentPadding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 8,
                          ),
                          leading: CircleAvatar(
                            backgroundColor: cs.primaryContainer,
                            child: Icon(Icons.shopping_bag,
                                color: cs.onPrimaryContainer),
                          ),
                          title: Text(
                            p.nombre,
                            style: const TextStyle(
                              fontWeight: FontWeight.w700,
                              fontSize: 16,
                            ),
                          ),
                          subtitle: Text(
                            '${p.cantidad} ${p.unidad} · ${p.marca}',
                            style: TextStyle(color: cs.onSurfaceVariant),
                          ),
                          trailing: IconButton(
                            icon: Icon(Icons.close, color: cs.outline, size: 20),
                            onPressed: () {
                              setState(() => _productos.removeAt(index));
                            },
                          ),
                        ),
                      );
                    },
                  ),
          ),

          // ── Footer contador ──
          if (_productos.isNotEmpty)
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: cs.surfaceContainerHighest,
                border: Border(top: BorderSide(color: cs.outlineVariant)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    '${_productos.length} producto${_productos.length == 1 ? '' : 's'} en tu lista',
                    style: TextStyle(
                      fontWeight: FontWeight.w600,
                      color: cs.onSurface,
                    ),
                  ),
                  FilledButton.icon(
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text(
                            '✅ Lista con ${_productos.length} productos confirmada',
                          ),
                          backgroundColor: cs.primary,
                        ),
                      );
                    },
                    icon: const Icon(Icons.check),
                    label: const Text('Confirmar'),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
}
