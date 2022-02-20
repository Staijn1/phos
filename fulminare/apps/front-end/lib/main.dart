import 'package:Fulminare/src/pages/home.dart';
import 'package:flutter/material.dart';

void main() => runApp(Fulminare());

class Fulminare extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return const MaterialApp(title: 'Fulminare', home: HomePage());
  }
}
