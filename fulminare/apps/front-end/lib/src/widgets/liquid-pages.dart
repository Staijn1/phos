import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import '../pages/home.dart';
import '../pages/mode.dart';

const textStyle = TextStyle(fontSize: 20, color: Colors.white);


final liquidPages = [
  Container(
      child: const HomePage()
  ),
  Container(
      child: const ModePage()
  ),
  Container(
      color: Colors.deepPurpleAccent,
      child: const Center(
        child: Text("Slide 3", style: textStyle),
      )
  )
];
