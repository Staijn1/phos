import 'package:Fulminare/src/widgets/liquid-pages.dart';
import 'package:flutter/material.dart';
import 'package:liquid_swipe/liquid_swipe.dart';

void main() => runApp(Fulminare());

class Fulminare extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Builder(
          builder: (context) => LiquidSwipe(
                pages: liquidPages,
                fullTransitionValue: 1000,
                enableLoop: true,
                slideIconWidget: const Icon(Icons.arrow_back_ios),
                enableSideReveal: true,
                waveType: WaveType.liquidReveal,
              )),
    );
  }
}
